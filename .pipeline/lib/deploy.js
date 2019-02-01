'use strict';
const {Pipeline, OpenShiftClient, OpenShiftClientX} = require('pipeline-cli')
const path = require('path');


module.exports = (settings)=>{
  const oc=new OpenShiftClientX();
  oc.globalArgs.namespace = `devhub-${oc.options.env}`
  var templateFile = path.resolve(__dirname, '../../openshift/dc.yaml')
  const appName = 'reggie-web'
  const buildNamespace = 'devhub-tools'
  const buildVersion = '1.0.0'
  const deploymentVersion = `${oc.options.env}-1.0.0`
  // remove pr in prefix for test and prod environemnt:
  const projectPrefix = oc.options.env === "dev" ? `-${oc.options.env}-${oc.options.pr}` : `-${oc.options.env}`

  const extraParam = {
    API_BASE_URL_VALUE: `https://reggie-api${projectPrefix}-devhub-${oc.options.env}.pathfinder.gov.bc.ca`,
  }

  var objects = oc.process(oc.toFileUrl(templateFile), {
    'param':{
      ...{
        'NAME':appName,
        'SUFFIX':projectPrefix,
        'VERSION':`${deploymentVersion}`
      },
      ...extraParam,
    }
  })

  oc.applyBestPractices(objects)
  oc.applyRecommendedLabels(objects, appName, oc.options.env, oc.options.pr)
  oc.fetchSecretsAndConfigMaps(objects)
  oc.importImageStreams(objects, deploymentVersion, buildNamespace, buildVersion)
  oc.applyAndDeploy(objects, `${appName}${projectPrefix}`)

}