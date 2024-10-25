"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class CdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Docker Lambda for the FastAPI backend
        const fastApiDockerImage = new lambda.DockerImageFunction(this, 'FastApiDockerFunction', {
            code: lambda.DockerImageCode.fromImageAsset('../backend'), // Path to FastAPI backend Dockerfile
            memorySize: 1024,
            timeout: cdk.Duration.seconds(30),
            architecture: lambda.Architecture.X86_64,
        });
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
        // Docker Lambda for the Frontend
        const frontendDockerImage = new lambda.DockerImageFunction(this, 'FrontendDockerFunction', {
            code: lambda.DockerImageCode.fromImageAsset('../frontend'), // Path to the frontend Dockerfile
            memorySize: 1024,
            timeout: cdk.Duration.seconds(30),
            architecture: lambda.Architecture.X86_64,
        });
        const frontendFunctionUrl = frontendDockerImage.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
            cors: {
                allowedMethods: [lambda.HttpMethod.ALL],
                allowedHeaders: ['*'],
                allowedOrigins: ['*'],
            },
        });
        new cdk.CfnOutput(this, 'FrontendFunctionUrl', {
            value: frontendFunctionUrl.url,
            description: 'The URL for the frontend served through Lambda',
        });
    }
}
exports.CdkStack = CdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyxpREFBaUQ7QUFDakQseURBQXlEO0FBR3pELE1BQWEsUUFBUyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3JDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsd0NBQXdDO1FBQ3hDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQ3ZGLElBQUksRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRSxxQ0FBcUM7WUFDaEcsVUFBVSxFQUFFLElBQUk7WUFDaEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNqQyxZQUFZLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNO1NBQ3pDLENBQUMsQ0FBQztRQUVILHVEQUF1RDtRQUN2RCxNQUFNLGNBQWMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQzNFLE9BQU8sRUFBRSxrQkFBa0I7WUFDM0IsS0FBSyxFQUFFLElBQUk7WUFDWCxXQUFXLEVBQUUsaUNBQWlDO1NBQy9DLENBQUMsQ0FBQztRQUVILHlCQUF5QjtRQUN6QixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNoQyxLQUFLLEVBQUUsY0FBYyxDQUFDLEdBQUc7WUFDekIsV0FBVyxFQUFFLDBDQUEwQztTQUN4RCxDQUFDLENBQUM7UUFFSCxpQ0FBaUM7UUFDakMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDekYsSUFBSSxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxFQUFFLGtDQUFrQztZQUM5RixVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ2pDLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU07U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQyxjQUFjLENBQUM7WUFDN0QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJO1lBQ3pDLElBQUksRUFBRTtnQkFDSixjQUFjLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztnQkFDdkMsY0FBYyxFQUFFLENBQUMsR0FBRyxDQUFDO2dCQUNyQixjQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUM7YUFDdEI7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQzdDLEtBQUssRUFBRSxtQkFBbUIsQ0FBQyxHQUFHO1lBQzlCLFdBQVcsRUFBRSxnREFBZ0Q7U0FDOUQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBL0NELDRCQStDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgY2xhc3MgQ2RrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBEb2NrZXIgTGFtYmRhIGZvciB0aGUgRmFzdEFQSSBiYWNrZW5kXG4gICAgY29uc3QgZmFzdEFwaURvY2tlckltYWdlID0gbmV3IGxhbWJkYS5Eb2NrZXJJbWFnZUZ1bmN0aW9uKHRoaXMsICdGYXN0QXBpRG9ja2VyRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuRG9ja2VySW1hZ2VDb2RlLmZyb21JbWFnZUFzc2V0KCcuLi9iYWNrZW5kJyksIC8vIFBhdGggdG8gRmFzdEFQSSBiYWNrZW5kIERvY2tlcmZpbGVcbiAgICAgIG1lbW9yeVNpemU6IDEwMjQsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgICBhcmNoaXRlY3R1cmU6IGxhbWJkYS5BcmNoaXRlY3R1cmUuWDg2XzY0LFxuICAgIH0pO1xuXG4gICAgLy8gRXhwb3NlIHRoZSBGYXN0QVBJIERvY2tlciBMYW1iZGEgdGhyb3VnaCBBUEkgR2F0ZXdheVxuICAgIGNvbnN0IGZhc3RBcGlHYXRld2F5ID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhUmVzdEFwaSh0aGlzLCAnRmFzdEFwaUVuZHBvaW50Jywge1xuICAgICAgaGFuZGxlcjogZmFzdEFwaURvY2tlckltYWdlLFxuICAgICAgcHJveHk6IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FQSSBHYXRld2F5IGZvciBGYXN0QVBJIGJhY2tlbmQnLFxuICAgIH0pO1xuXG4gICAgLy8gT3V0cHV0IEFQSSBHYXRld2F5IFVSTFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdBcGlVcmwnLCB7XG4gICAgICB2YWx1ZTogZmFzdEFwaUdhdGV3YXkudXJsLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgQVBJIEdhdGV3YXkgZW5kcG9pbnQgVVJMIGZvciBGYXN0QVBJJyxcbiAgICB9KTtcblxuICAgIC8vIERvY2tlciBMYW1iZGEgZm9yIHRoZSBGcm9udGVuZFxuICAgIGNvbnN0IGZyb250ZW5kRG9ja2VySW1hZ2UgPSBuZXcgbGFtYmRhLkRvY2tlckltYWdlRnVuY3Rpb24odGhpcywgJ0Zyb250ZW5kRG9ja2VyRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuRG9ja2VySW1hZ2VDb2RlLmZyb21JbWFnZUFzc2V0KCcuLi9mcm9udGVuZCcpLCAvLyBQYXRoIHRvIHRoZSBmcm9udGVuZCBEb2NrZXJmaWxlXG4gICAgICBtZW1vcnlTaXplOiAxMDI0LFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgICAgYXJjaGl0ZWN0dXJlOiBsYW1iZGEuQXJjaGl0ZWN0dXJlLlg4Nl82NCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGZyb250ZW5kRnVuY3Rpb25VcmwgPSBmcm9udGVuZERvY2tlckltYWdlLmFkZEZ1bmN0aW9uVXJsKHtcbiAgICAgIGF1dGhUeXBlOiBsYW1iZGEuRnVuY3Rpb25VcmxBdXRoVHlwZS5OT05FLFxuICAgICAgY29yczoge1xuICAgICAgICBhbGxvd2VkTWV0aG9kczogW2xhbWJkYS5IdHRwTWV0aG9kLkFMTF0sXG4gICAgICAgIGFsbG93ZWRIZWFkZXJzOiBbJyonXSxcbiAgICAgICAgYWxsb3dlZE9yaWdpbnM6IFsnKiddLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdGcm9udGVuZEZ1bmN0aW9uVXJsJywge1xuICAgICAgdmFsdWU6IGZyb250ZW5kRnVuY3Rpb25VcmwudXJsLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgVVJMIGZvciB0aGUgZnJvbnRlbmQgc2VydmVkIHRocm91Z2ggTGFtYmRhJyxcbiAgICB9KTtcbiAgfVxufVxuIl19