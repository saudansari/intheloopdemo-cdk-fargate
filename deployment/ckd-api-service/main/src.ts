import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcrStack } from '../lib/ecr-stack';
import { FargateStack } from '../lib/fargate-stack';

const app = new cdk.App();

let stackName = process.env.STACK_NAME as string
if (stackName == "ECR-STACK") {
  new EcrStack(app, 'EcrStack');

}
if (stackName == "FARGATE-STACK") {
  new FargateStack(app, 'FargateStack');
}
