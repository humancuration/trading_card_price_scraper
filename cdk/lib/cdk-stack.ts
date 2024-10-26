import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as cw_actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Construct } from 'constructs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table for log persistence
    const logsTable = new dynamodb.Table(this, 'LogsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      timeToLiveAttribute: 'ttl',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    });

    // Add GSI for filtering logs by level and category
    logsTable.addGlobalSecondaryIndex({
      indexName: 'LogLevelIndex',
      partitionKey: { name: 'level', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
    });

    logsTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
    });

    // SNS Topic for alerts
    const alertTopic = new sns.Topic(this, 'AlertTopic', {
      displayName: 'Application Alerts',
    });

    // Add email subscription (replace with your email)
    alertTopic.addSubscription(
      new subscriptions.EmailSubscription('your-email@example.com')
    );

    // Docker Lambda for the FastAPI backend
    const fastApiDockerImage = new lambda.DockerImageFunction(this, 'FastApiDockerFunction', {
      code: lambda.DockerImageCode.fromImageAsset('../backend'),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      architecture: lambda.Architecture.X86_64,
      environment: {
        LOGS_TABLE_NAME: logsTable.tableName,
        ALERT_TOPIC_ARN: alertTopic.topicArn,
      },
    });

    // Grant DynamoDB permissions to Lambda
    logsTable.grantWriteData(fastApiDockerImage);
    alertTopic.grantPublish(fastApiDockerImage);

    // CloudWatch Metrics and Alarms
    const apiLatencyMetric = new cloudwatch.Metric({
      namespace: 'APIMetrics',
      metricName: 'Latency',
      statistic: 'Average',
      period: cdk.Duration.minutes(1),
    });

    const errorRateMetric = new cloudwatch.Metric({
      namespace: 'APIMetrics',
      metricName: 'ErrorRate',
      statistic: 'Sum',
      period: cdk.Duration.minutes(1),
    });

    // High Latency Alarm
    const highLatencyAlarm = new cloudwatch.Alarm(this, 'HighLatencyAlarm', {
      metric: apiLatencyMetric,
      threshold: 1000, // 1 second
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
      alarmDescription: 'API Latency is too high',
    });

    // High Error Rate Alarm
    const highErrorRateAlarm = new cloudwatch.Alarm(this, 'HighErrorRateAlarm', {
      metric: errorRateMetric,
      threshold: 10, // 10 errors per minute
      evaluationPeriods: 2,
      datapointsToAlarm: 2,
      alarmDescription: 'API Error Rate is too high',
    });

    // Connect alarms to SNS topic
    highLatencyAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));
    highErrorRateAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));

    // API Gateway with logging and monitoring
    const fastApiGateway = new apigateway.LambdaRestApi(this, 'FastApiEndpoint', {
      handler: fastApiDockerImage,
      proxy: true,
      description: 'API Gateway for FastAPI backend',
      deployOptions: {
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        tracingEnabled: true,
      },
    });

    // Dashboard for monitoring
    const dashboard = new cloudwatch.Dashboard(this, 'MonitoringDashboard', {
      dashboardName: 'ApplicationMetrics',
    });

    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'API Latency',
        left: [apiLatencyMetric],
      }),
      new cloudwatch.GraphWidget({
        title: 'Error Rate',
        left: [errorRateMetric],
      }),
      new cloudwatch.GraphWidget({
        title: 'API Requests',
        left: [fastApiGateway.metricCount()],
      }),
      new cloudwatch.GraphWidget({
        title: '4XX Errors',
        left: [fastApiGateway.metric4XXError()],
      }),
      new cloudwatch.GraphWidget({
        title: '5XX Errors',
        left: [fastApiGateway.metric5XXError()],
      })
    );

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: fastApiGateway.url,
      description: 'The API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'LogsTableName', {
      value: logsTable.tableName,
      description: 'DynamoDB table for logs',
    });

    new cdk.CfnOutput(this, 'AlertTopicArn', {
      value: alertTopic.topicArn,
      description: 'SNS Topic for alerts',
    });

    new cdk.CfnOutput(this, 'DashboardURL', {
      value: `https://${this.region}.console.aws.amazon.com/cloudwatch/home?region=${this.region}#dashboards:name=${dashboard.dashboardName}`,
      description: 'CloudWatch Dashboard URL',
    });
  }
}
