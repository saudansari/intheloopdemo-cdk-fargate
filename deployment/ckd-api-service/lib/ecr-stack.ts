import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr'

export class EcrStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ecr.Repository(this, 'ecr-repo', {
      repositoryName: 'api-service-repository'
    })
  }
}
