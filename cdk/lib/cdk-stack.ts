import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Docker Lambda for the FastAPI backend
    const fastApiDockerImage = new lambda.DockerImageFunction(this, 'FastApiDockerFunction', {
      code: lambda.DockerImageCode.fromImageAsset('../backend'), // Path to FastAPI backend Dockerfile
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      architecture: lambda.Architecture.X86_64,
      environment: {
        API_GATEWAY_URL: '', // Placeholder for now
      },
    });

    fastApiDockerImage.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));

    // Expose the FastAPI Docker Lambda through API Gateway
    const fastApiGateway = new apigateway.LambdaRestApi(this, 'FastApiEndpoint', {
      handler: fastApiDockerImage,
      proxy: true,
      description: 'API Gateway for FastAPI backend',
    });

    // Output API Gateway URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: fastApiGateway.url,
      description: 'The API Gateway endpoint URL for FastAPI',
    });
  }
}
