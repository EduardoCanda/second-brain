---
tags:
  - Fundamentos
  - Programacao
  - NotaPermanente
linguagem: Java
---
Na gestão de memória do Java existe um mecanismo automático chamado [[garbage-collector]], ele é responsável pro realizar a gestão e controle de [[gerenciamento-memoria#🔹 1. **Heap Memory**|Memoria Heap]], essa memória é dividida em algumas áreas e nessas que o garbage collector irá trabalhar.

De forma resumida existem duas áreas principáis, uma chamada [[gerenciamento-memoria#Subdivisões|Young Generation]] onde os objetos novos serão enviados e a outra chamada [[gerenciamento-memoria#Subdivisões|Old Generation]] onde os objetos que sobrevivem a varios ciclos de garbage collector serão enviados(Lembrando que dentro do Young Generation existe uma área que os objetos são enviados depois de alguns ciclos de sobrevivencia.) 

Esses processos de limpeza em memoria Young e old são chamados respectivamente de [[garbage-collector#🔸 **Minor GC** (ou Young GC)|Minor GC]] e [[garbage-collector#🔸 **Major GC / Full GC**|Major GC]].

O Garbage collector passou por várias evoluções ao longo das versões do Java e existem mecanismos e forma de obter um melhor aproveitamento de cada versão deste de forma a ter o melhor para cada ambiente/infra-estrutura, para informações sobre esses leia a [[garbage-collector#🔧 **Algoritmos de Garbage Collector disponíveis **|nota completa]]
