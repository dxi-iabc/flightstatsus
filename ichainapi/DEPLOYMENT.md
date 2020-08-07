# Deployment with gitlab-ci

This project uses the gitlab deployment pipelines to create a docker image for the API, and then deploys it.

## AWS Setup

### Container Registry

The CI files use the AWS Container Registry for storing docker images. This registry is setup at
https://eu-west-1.console.aws.amazon.com/ecs/home?region=eu-west-1#/repositories/flightchain#images;tagStatus=ALL.

This may change to use the gitlab docker repository if/when we move to Kubernetes environment.

### IAM

There is a dedicated AWS IAM user `gitlab-runner`, with ElasticBeanstalk and ContainerRegistry permissions. 
See https://console.aws.amazon.com/iam/home?#/users/gitlab-runner?section=security_credentials.

The AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY are set as variables in the https://gitlab.com/FlightChain2/FlightChainAPI/settings/ci_cd 
settings page.  

### ElasticBeanstalk.