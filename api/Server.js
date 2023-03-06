const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const ec2 = new AWS.EC2();


const getInstances = async () => {
  const data = await ec2.describeInstances().promise();
  const instanceList = [];
  for (const reservation of data.Reservations) {
    for (const instance of reservation.Instances) {
      let name = '';
      let storage = '';
      let publicIp = '';
      let privateIp = '';
      let os = '';
      let instanceType = '';
      let cpu = '';
      let mem = '';

      // Verificando se a instância possui um nome
      if (instance.Tags) {
        for (const tag of instance.Tags) {
          if (tag.Key === 'Name') {
            name = tag.Value;
          }
        }
      }

      // Buscando as informações de armazenamento da instância
      for (const blockDevice of instance.BlockDeviceMappings) {
        const volumeId = blockDevice.Ebs.VolumeId;
        const response = await ec2.describeVolumes({ VolumeIds: [volumeId] }).promise();
        const volume = response.Volumes[0];
        const storageType = volume.VolumeType;
        const storageSize = `${volume.Size || 0} GiB`;
        storage = `${storageType} (${storageSize})`;
      }

      // Verificando se a instância possui um IP público
      if (instance.PublicIpAddress) {
        publicIp = instance.PublicIpAddress;
      }

      // Buscando o IP privado da instância
      privateIp = instance.PrivateIpAddress;

      // Buscando o sistema operacional da instância
      const osResponse = await ec2.describeInstanceAttribute({ InstanceId: instance.InstanceId, Attribute: 'instanceType' }).promise();
      os = osResponse.InstanceType.Value.split('_')[0];

      // Buscando as informações do tipo de instância, CPU e memória
      const instanceTypeResponse = await ec2.describeInstanceTypes({ InstanceTypes: [instance.InstanceType] }).promise();
      const instanceTypeInfo = instanceTypeResponse.InstanceTypes[0];
      instanceType = instanceTypeInfo.InstanceType;
      cpu = `${instanceTypeInfo.VCpuInfo.DefaultVCpus}`;
      mem = `${(instanceTypeInfo.MemoryInfo.SizeInMiB * 0.0009765625).toFixed(2)} GiB`;

      // Adicionando as informações da instância na lista
      instanceList.push({
        name,
        public_ip: publicIp,
        private_ip: privateIp,
        operating_system: os,
        instance_type: instanceType,
        cpu,
        memory: mem,
        storage,
      });
    }
  }
  return instanceList;
};

module.exports = {
    getInstances
  };