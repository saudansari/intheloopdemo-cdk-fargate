# intheloopdemo-cdk-fargate
Repository for In The Loop demo for CDK - Fargate

## Prerequisites
  - AWS Account
  - AWS CLI (with Credentials)
  - Docker
  - NPM 
  - TypeScript (npm -g install typescript)
  - dotnet 

---

## Step 1: Build and Run the .NET Core MVC App
Build:
```powershell  
> dotnet build .\Api.Service.csproj  
```

Run
```powershell  
> dotnet run .\Api.Service.csproj
```
---

## Step 2: Build and Run the Docker Container

Build an Image of the container
```powershell  
> docker build -t apiservice .
```
Run an instance of the image

```powershell  
> docker run -d -p 5001:80 --name api apiservice
```

Login to Bash of the running container
```powershell  
> docker exec -it api /bin/bash
```

```
GET http://localhost:5001/api/ping?request=1
```
---
## Step 3: CDK Stack to build an ECR Repository in AWS

We need to push our Docker Image (apiservice) to ECR in AWS. For that we need to create a repository in ECR. To create the repository, we will use CDK. 

- Workshop: http://cdkworkshop.com/

- Api Reference: https://docs.aws.amazon.com/cdk/api/latest/

Install CDK
```powershell  
> npm install -g aws-cdk
```

Initialize CDK Project
```powershell  
> cdk init -a ecr-stack -l typescript
```

Compile the Project
```powershell  
> npm run build
```

List Stacks in the CDK Project
```powershell  
> cdk ls
```

### Install ECR Package
Npm Package: @aws-cdk/aws-ecr

Synthesize CDK to ensure cdk is able to convert code into yaml
```powershell  
> cdk synth EcrRepoStack
```
Do a DIFF against an environment to see what is the difference b/w local and account. 
```powershell  
> cdk diff EcrRepoStack --profile devops
```

Deploy the stack
```powershell  
> cdk deploy EcrRepoStack --profile devops
```
---
## Step 4: Push Docker Image To ECR

Push the Docker Image to ECR Repository using AWS Credentials

Get a docker Login for ECR
```powershell  
> aws ecr get-login --no-include-email --region ap-southeast-2
```

User docker to login to AWS-ECR
```powershell  
> docker login -u AWS -p eyJwYXlsb2FkIjoiRjNIWmg4NWovRFdmQmVrR1dJN01....
```

Build the Image
```powershell  
> docker build -t api-service-repository .
```

Give the build Image the ECR Tag
```powershell  
> docker tag api-service-repository:latest 19XXXXXXXXX7.dkr.ecr.ap-southeast-2.amazonaws.com/api-service-repository:latest
```

Push the Tagged Image to ECR
```powershell  
> docker push 19XXXXXXXXX7.dkr.ecr.ap-southeast-2.amazonaws.com/api-service-repository:latest
```

---

## Step 5: CDK Create a new Stack for Fargate Service and LoadBalancer 

### Install the Following Package
- @aws-cdk/aws-ecr
- @aws-cdk/aws-ec2
- @aws-cdk/aws-ecs
- @aws-cdk/aws-elasticloadbalancingv2
- @aws-cdk/aws-logs



