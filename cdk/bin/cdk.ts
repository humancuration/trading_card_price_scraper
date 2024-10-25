import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
new CdkStack(app, 'CdkStack', {
  // You can specify environment properties here if needed, for example:
  // env: { account: 'your-account-id', region: 'us-east-1' }
});
