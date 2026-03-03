# CI/CD — Jenkins

## Conceitos principais
- **Controller**: orquestra jobs e pipelines.
- **Agents**: executam builds.
- **Jenkinsfile**: pipeline como código.

## Exemplo declarativo
```groovy
pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'npm ci && npm run build'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }
}
```

## Boas práticas
- Versionar Jenkinsfile no repositório.
- Isolar builds por agente.
- Usar credenciais do Jenkins Credentials Store.
- Integrar com SonarQube e scanners de segurança.
