---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: hibrido
cloud_provider: aws
categoria: computacao
---
Aqui está um exemplo completo de **CloudFormation** que provisiona:  

1. **Cluster [[ECS]]** com instâncias **[[EC2]]**.  
2. **Capacity Provider** vinculado a um **[[Auto Scaling Group]] (ASG)**.  
3. **Serviço ECS** executando um **web server Nginx** com variáveis de ambiente.  
4. **[[Application Load Balancer]] (ALB)** para rotear tráfego.  

---

### **Template CloudFormation (`ecs-cluster-with-asg.yml`)**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: ECS Cluster with EC2 Auto Scaling and Capacity Provider

Parameters:
  VpcId:
    Type: AWS::EC2::VPC::Id
    Description: ID da VPC onde o cluster será implantado.
  SubnetIds:
    Type: List<AWS::EC2::Subnet::Id>
    Description: Subnets para o ALB e instâncias EC2.
  InstanceType:
    Type: String
    Default: t3.medium
    Description: Tipo da instância EC2 (ex.: t3.medium).

Resources:
  # 1. Security Group para o ALB e instâncias ECS
  ALBSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: "Permite tráfego HTTP para o ALB"
      VpcId: !Ref VpcId
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0

  ECSSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: "Permite tráfego do ALB para as instâncias ECS"
      VpcId: !Ref VpcId
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          SourceSecurityGroupId: !GetAtt ALBSecurityGroup.GroupId

  # 2. ALB para rotear tráfego
  ECSLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Scheme: internet-facing
      Subnets: !Ref SubnetIds
      SecurityGroups:
        - !GetAtt ALBSecurityGroup.GroupId

  ECSTargetGroup:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      Port: 80
      Protocol: HTTP
      VpcId: !Ref VpcId
      TargetType: instance
      HealthCheckPath: /

  ALBListener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      LoadBalancerArn: !Ref ECSLoadBalancer
      Port: 80
      Protocol: HTTP
      DefaultActions:
        - Type: forward
          TargetGroupArn: !Ref ECSTargetGroup

  # 3. Launch Template para instâncias EC2 (com ECS Agent)
  ECSLaunchTemplate:
    Type: AWS::EC2::LaunchTemplate
    Properties:
      LaunchTemplateData:
        InstanceType: !Ref InstanceType
        SecurityGroupIds:
          - !GetAtt ECSSecurityGroup.GroupId
        IamInstanceProfile:
          Arn: !GetAtt ECSInstanceProfile.Arn
        UserData:
          Fn::Base64: !Sub |
            #!/bin/bash
            echo "ECS_CLUSTER=${ECSCluster}" >> /etc/ecs/ecs.config

  # 4. Auto Scaling Group (ASG) para o cluster ECS
  ECSAutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      LaunchTemplate:
        LaunchTemplateId: !Ref ECSLaunchTemplate
        Version: !GetAtt ECSLaunchTemplate.LatestVersionNumber
      MinSize: 1
      MaxSize: 4
      DesiredCapacity: 2
      VPCZoneIdentifier: !Ref SubnetIds
      TargetGroupARNs:
        - !Ref ECSTargetGroup

  # 5. Capacity Provider vinculado ao ASG
  ECSCapacityProvider:
    Type: AWS::ECS::CapacityProvider
    Properties:
      Name: "EC2-CapacityProvider"
      AutoScalingGroupProvider:
        AutoScalingGroupArn: !Ref ECSAutoScalingGroup
        ManagedScaling:
          Status: "ENABLED"
          TargetCapacity: 90  # Mantém 10% de capacidade ociosa
        ManagedTerminationProtection: "ENABLED"

  # 6. Cluster ECS
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: "my-ecs-cluster"
      CapacityProviders:
        - !Ref ECSCapacityProvider
      DefaultCapacityProviderStrategy:
        - CapacityProvider: !Ref ECSCapacityProvider
          Weight: 1
          Base: 1

  # 7. Task Definition (Nginx com variáveis de ambiente)
  ECSTaskDefinition:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Family: "nginx-task"
      NetworkMode: "awsvpc"
      Cpu: "256"
      Memory: "512"
      RequiresCompatibilities:
        - "EC2"
      ContainerDefinitions:
        - Name: "nginx"
          Image: "nginx:latest"
          PortMappings:
            - ContainerPort: 80
          Environment:
            - Name: "ENV_SAMPLE"
              Value: "production"

  # 8. Serviço ECS
  ECSService:
    Type: AWS::ECS::Service
    Properties:
      ServiceName: "nginx-service"
      Cluster: !Ref ECSCluster
      TaskDefinition: !Ref ECSTaskDefinition
      DesiredCount: 2
      LaunchType: "EC2"
      LoadBalancers:
        - ContainerName: "nginx"
          ContainerPort: 80
          TargetGroupArn: !Ref ECSTargetGroup
      NetworkConfiguration:
        AwsvpcConfiguration:
          Subnets: !Ref SubnetIds
          SecurityGroups:
            - !GetAtt ECSSecurityGroup.GroupId

  # 9. IAM Role para instâncias EC2
  ECSInstanceRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: "Allow"
            Principal:
              Service: ["ec2.amazonaws.com"]
            Action: ["sts:AssumeRole"]
      ManagedPolicyArns:
        - "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"

  ECSInstanceProfile:
    Type: AWS::IAM::InstanceProfile
    Properties:
      Roles:
        - !Ref ECSInstanceRole

Outputs:
  ClusterName:
    Description: "Nome do Cluster ECS"
    Value: !Ref ECSCluster
  ServiceName:
    Description: "Nome do Serviço ECS"
    Value: !GetAtt ECSService.Name
  LoadBalancerDNS:
    Description: "DNS do Load Balancer"
    Value: !GetAtt ECSLoadBalancer.DNSName
```

---

## **Como Implantar?**  
1. **Salve o template** como `ecs-cluster-with-asg.yml`.  
2. **Execute no AWS Console (CloudFormation) ou via CLI**:  
   ```bash
   aws cloudformation create-stack \
     --stack-name ECSClusterWithASG \
     --template-body file://ecs-cluster-with-asg.yml \
     --parameters \
       ParameterKey=VpcId,ParameterValue=vpc-123456 \
       ParameterKey=SubnetIds,ParameterValue=\"subnet-123456,subnet-654321\" \
     --capabilities CAPABILITY_IAM
   ```

---

## **O Que Este Template Faz?**  
1. **Cria um cluster ECS** com instâncias EC2.  
2. **Configura um Capacity Provider** vinculado a um ASG (escala instâncias quando há tasks pendentes).  
3. **Implanta um serviço ECS** com Nginx e variáveis de ambiente.  
4. **Adiciona um ALB** para rotear tráfego HTTP.  
5. **Gerenciamento automático**:  
   - Se as tasks consumirem >90% da capacidade, o ASG adiciona instâncias.  
   - Se a demanda cair, o ASG remove instâncias ociosas.  

---

## **Próximos Passos**  
- **Teste o ALB**: Acesse o `DNSName` (output do template) no navegador.  
- **Ajuste políticas de scaling**: Modifique `TargetCapacity` ou adicione métricas customizadas.  
- **Adicione mais serviços**: Estenda o template para incluir outros containers.  

Quer personalizar algo? Posso adaptar o template! 🚀