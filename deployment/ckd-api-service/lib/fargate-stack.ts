import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs'
import * as ecr from '@aws-cdk/aws-ecr'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as awslogs from '@aws-cdk/aws-logs'
import * as elb from '@aws-cdk/aws-elasticloadbalancingv2'

export class FargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // You might need to change the properties for this
    let vpc = new ec2.Vpc(this, 'my-vpc')

    let securityGroupId = cdk.Fn.importValue('qa-TocaServicesSecurityGroup');
    let securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'TocaServicesSG', securityGroupId);



    let taskDefintion = new ecs.FargateTaskDefinition(this, 'api-service-taskdev', {
      cpu: 512,
      memoryLimitMiB: 1024,
      family: 'ApiService-TaskDef'
    });

    let serviceRepo = ecr.Repository.fromRepositoryName(this, 'ecr-repository', "api-service-repository")

    let loggroup = new awslogs.LogGroup(this, 'service-loggroup', {
      logGroupName: "api-service-loggroup",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    let apiContainer = taskDefintion.addContainer('ApiServiceContainer', {
      image: ecs.ContainerImage.fromEcrRepository(serviceRepo),
      cpu: 512,
      memoryLimitMiB: 1024,
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: "api-service-log",
        logGroup: loggroup
      })
    });

    apiContainer.addPortMappings({
      containerPort: 80,
      hostPort: 80,
      protocol: ecs.Protocol.TCP
    });

    taskDefintion.defaultContainer = apiContainer;


    let fargateCluster = new ecs.Cluster(this, 'intheloop-demo-cluster', {
      clusterName: 'InTheLoopDemo-Cluster',
      vpc: vpc
    })

    let fargateService = new ecs.FargateService(this, 'api-fargate-service', {
      taskDefinition: taskDefintion,
      cluster: fargateCluster,
      securityGroups: [securityGroup],
      deploymentController: {
        type: ecs.DeploymentControllerType.ECS
      },
      desiredCount: 2,
      assignPublicIp: true,
      minHealthyPercent: 50,
      maxHealthyPercent: 100,
    });


    let serviceALB = new elb.ApplicationLoadBalancer(this, 'apiServiceALB', {
      vpc: vpc,
      securityGroup: securityGroup,
      internetFacing: true,
      ipAddressType: elb.IpAddressType.IPV4,
      deletionProtection: false,
      http2Enabled: true,
      idleTimeout: cdk.Duration.seconds(3),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
        onePerAz: false
      }
    });

    let serviceTargetGroup = new elb.ApplicationTargetGroup(this, 'apiTargetGroup', {
      vpc: vpc,
      protocol: elb.ApplicationProtocol.HTTP,
      port: 80,
      targetType: elb.TargetType.IP,
      deregistrationDelay: cdk.Duration.seconds(30),
      healthCheck: {
        protocol: elb.Protocol.HTTP,
        path: '/healthcheck',
        healthyHttpCodes: '200',
        healthyThresholdCount: 2,
        interval: cdk.Duration.seconds(60),
        timeout: cdk.Duration.seconds(20),
        unhealthyThresholdCount: 5
      },
      slowStart: cdk.Duration.seconds(120)
    });

    serviceALB.addListener('http-listener', {
      protocol: elb.ApplicationProtocol.HTTP,
      port: 80,
      open: true,
      defaultTargetGroups: [serviceTargetGroup]
    });

    fargateService.attachToApplicationTargetGroup(serviceTargetGroup)

  }
}
