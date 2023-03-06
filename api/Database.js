const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const rds = new AWS.RDS();

const getDatabases = async () => {
  const data = await rds.describeDBInstances().promise();
  const instanceList = [];
  for (const instance of data.DBInstances) {
    let name = '';
    let engine = '';
    let engineVersion = '';
    let size = '';
    let maintenance = '';
    let storage = '';

    // Nome da instância RDS
    name = instance.DBInstanceIdentifier;

    // Motor de banco de dados
    engine = instance.Engine;

    // Versão do motor de banco de dados
    engineVersion = instance.EngineVersion;

    // Tamanho da instância RDS
    size = `${instance.DBInstanceClass} (${instance.DBInstanceIdentifier})`;

    // Status do maintenance
    maintenance = instance.DBInstanceStatus;

    // Informações sobre o armazenamento da instância RDS
    storage = `${instance.StorageEncrypted ? 'Encrypted' : 'Not encrypted'} ${instance.AllocatedStorage} GiB`;

    // Adicionando as informações da instância na lista
    instanceList.push({
      name,
      engine,
      engine_version: engineVersion,
      size,
      maintenance,
      storage,
    });
  }
  return instanceList;
};

module.exports = {
  getDatabases
};
