"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const cdk_stack_1 = require("../lib/cdk-stack");
const app = new cdk.App();
new cdk_stack_1.CdkStack(app, 'CdkStack', {
// You can specify environment properties here if needed, for example:
// env: { account: 'your-account-id', region: 'us-east-1' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXFDO0FBQ3JDLG1DQUFtQztBQUNuQyxnREFBNEM7QUFFNUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSxvQkFBUSxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUU7QUFDNUIsc0VBQXNFO0FBQ3RFLDJEQUEyRDtDQUM1RCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ2RrU3RhY2sgfSBmcm9tICcuLi9saWIvY2RrLXN0YWNrJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBDZGtTdGFjayhhcHAsICdDZGtTdGFjaycsIHtcbiAgLy8gWW91IGNhbiBzcGVjaWZ5IGVudmlyb25tZW50IHByb3BlcnRpZXMgaGVyZSBpZiBuZWVkZWQsIGZvciBleGFtcGxlOlxuICAvLyBlbnY6IHsgYWNjb3VudDogJ3lvdXItYWNjb3VudC1pZCcsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfVxufSk7XG4iXX0=