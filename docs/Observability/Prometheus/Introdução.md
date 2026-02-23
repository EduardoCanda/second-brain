temos 03 componentes _core_ no Prometheus:

- Retrieval
- Storage
- PromQL

O _Retrieval_ é o responsável por coletar as métricas e conversar com o _Storage_ para armazená-las. É o _Retrieval_ também o responsável por conversar com o Service Discovery para encontrar os serviços que estão disponíveis para coletar métricas.

Já o _Storage_ é o responsável por armazenar as métricas no TSDB, lembre-se que o TSDB é um time series database, super importante para otimizar a performance de coleta e leitura das métricas. Importante lembrar que o _Storage_armazena as métricas no disco local do node que ele está sendo executado. Com isso, caso você esteja com o Prometheus instalado em uma VM, os dados serão armazenados no disco local da VM.

O _PromQL_ é o responsável por executar as queries do usuário. Ele é o responsável por conversar com o _Storage_ para buscar as métricas que o usuário deseja. O _PromQL_ é uma riquíssima linguagem de consulta, ela não é parecida com outras linguagens de consulta como o SQL, por exemplo.