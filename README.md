## UCP Automation project 
.- lenguages: JavaScript, typeScript. 
.- Page Object Pattern, Cucumber, Gherkin lenguage, 
.- Test  coverage: E2E scenarios, UI and API scenarios.
.- libraries: chai, axios(API)
.- UCP automation repo :https://bitbucket.sdlc.toyota.com/scm/col/dd365-ucp-automation-test.git


&nbsp;

### Table of Contents
- [`Automation project UCP Structure)
- [`Execution Scripts ]
- [`Setting Local environment ]
- [`Tips and Recomendation]
- [`Jenkins execution]


&nbsp;

## Automation project UCP Structure

src ->  l
        l environments
        l features
        l support

1.- environments
this folder contains the configuration by each available env of the UCP app.

environments ->   l	
                  l environment.dev.ts
                  l environment.local.ts
                  l environment.qa.ts
                  l environment.stage.ts
                  l environments.ts

1.1-environment.dev.ts
this file contains the UCP URL path to the dev environments and users/passwords credentials needed for accessing UCP dev env. 	 

1.1-environment.local.ts
this file contains the UCP URL path local environments (localhost:3004/UCP) and users/passwords credentials needed for accessing UCP local env. 	 

1.1-environment.qa.ts
this file contains the UCP URL path to the qa environments and users/passwords credentials needed for accessing UCP qa env. 	 

1.1-environment.stage.ts
this file contains the UCP URL path to the stage environment and users/passwords credentials needed for accessingto UCP stage env. 	 




2.- features 
this folder contains other folders, each one of them contains test scenarios and its code regarding the UCP functionality.

features  l	
          l board
          l ccreate-car-form 
          l login 
          l settings
root folder 
        	l global_hooks.ts

2.1 .- board (Example folder)
this folder contains all test features regarding to the UCP board page view.

board         l
              l steps 
root folder	
              l file.feature

2.1.1.- steps
this folder contains the code test scenarios (classes and methods), regarding to the UCP modules. 

steps	l
      l board.steps.ts (Example scenarios)	
      l cars_flow_steps.ts (Example scenarios)	


2.1.2.- file.feature
feature files contain all the test feature scenarios written in Gherkin language regarding the UCP "board" page view. it exists on the root path of the feature folder.

features	l
        	l 
root folder	
	        l files.feature

2.1.3.- global_hooks.ts
this file contains the before, afters configuration which help to the test sceanrios to: clean up the envs used for the test execution, to complete a log In and LogOut session, close driver, etc.




3.- support
this folder contains other folders, each one of them contains utilities regarding to basic configuration of the API requests, test data, etc.

support	l
        l api_request
        l data
        l models
        l pages
        l utils

3.1.- api_request
this folder contains other folders, each one of them contains the APIs configuration CRUD of the UCP modules. 

api_request l
            l api-base.request.ts
            l dealer-config.request.ts
            l technician.request.ts
            l vehicle.request.ts
	

3.2.- data
this folder contains the input data for the automated test scenarios. example board page, dealer-conf page, vehicle data.

3.3.- model
this folder contains the data models strucutures related to the board, metrics, technician and vehicles data set, needed as a input data for the API request executions.

models  l
        l board.model.ts
        l metrics.model.ts
        l technicians.model.ts
        l vehicle.model.ts

3.4.- pages
this folder contains typescript files whichs contains the web elements, classes and methods regarding to each UCP funcionality.

pages l
      l application_page.ts (example)
      l baseline-metrics_page.ts (example)
      l board_page.ts (example)

3.5.- utils
this folder contains the files needed as a input data, business rules, dates, drivers configuration, clean up environments, wait times and 

utils  l
       l business-utils.ts (example)
       l date-utils.ts (example)
       l driver-utils (example)

3.6.1.- business-utils.ts
calculation for business scenarios, for instance(generate VIN, generate phone).

3.6.2.- date-utils.ts
contains business function for handling dates, set hours, days.  

3.6.3.- driver-utils.ts
basics configuration about selenium functionalities, for instance(wait for specific elements conditions)

3.6.4.- file-utils.ts
basics configuration about handling csv files (open, remove)

3.6.5.- model-utils.ts
basics configuration about handling data models (ex: set random name)

3.6.6.- phone-utils.ts
basics configuration about handling phone number structure.

3.6.7.- states.ts
basics configuration about cleaning up the env used for automation execution

3.6.8.- times.constant.ts
basics configuration about handling wait timeOuts

3.6.9.- utils.ts
initial configuration for starting up the project, handling of branches, token session,   

&nbsp;


## Setting Local environment 

for the local execution of the project is necesary:

Install NodeJs locally:
1.- download the nodejs installer from ->  https://nodejs.org/en/download/.
2.- once completed the installation 
3.- verify the node version installed
.- open a new cmd window
.- to validate the node version installed type the next command -> node -v. 

Install selenium web driver for Chrome browser
1.- Download selenium webdriver from https://chromedriver.chromium.org/downloads
2.- create a new folder on "C:\" and name it as "webdrivers".  example "C:\webdrivers".
3.- dowload the driver into this new folder.
4.- Go to the conf Environment Variables on windows and create a new var at the "User Variables" section
4.- At the Path varible, press "Edit" and include the root of the new folder created "C:\webdrivers". 

To clone the project:
1.- Create a new folder in the local machine
2.- Once inside, Open a new CMD window
3.- type the git command : git clone the ["UCP automation repo"]

&nbsp;


## Execution Scripts 

1. To run all tests do the following:

- npm run test:[env]

2. To run a test in a specific feature do the following:

- npm run test:[env] -- features/**/[feature_name].feature

3. To run a test in a specific tag do the following:

- npm run test:[env] -- --tags '[tag_name]'

4. To run a test in a specific feature and a specific tag mix 2 and 3:

- npm run test:[env] -- features/**/[feature_name].feature --tags '[tag_name]'

5. To run a test without Chrome Headless:

- npm run test:NOT-HEADLESS

&nbsp;


## Tips and Recomendation

1.- Please, try to keep the web browser and selenium web driver at a common compatibility version, for instance (if chrome browser is 87 the webDriver must be the same version).
2.- Please, try to dont run in parallel (2 or 3 excecution) of the same project because it for example, might cause overlapping on the creation of campaigns or orders.


&nbsp;

## Jenkins execution

### Continuous integration

A change (commit) in the master branch triggers the TMNA pipeline called [ciDocker](https://confluence.sdlc.toyota.com/pages/viewpage.action?pageId=117875488#JenkinsPipelines-ci-common-docker-parameters).

This pipeline starts a job that runs 'docker build'. compiling the Dockerfile in this repository, if the build process runs successfully, it proceeds to send the built image to the TMNA artifactory and mark the bitbucket commit as approved.

If the build process fails, the job execution stops, sends a mail to the commit author, and marks the commit from bitbucket as failed.

### Dockerfile

Dockerfile defines docker build process that will be executed by jenkins job, this docker file does the following:

* Pull from TMNA artifactory a selenium/node-chrome docker image as base image, this image contains selenium and a Google Chrome browser optimized for headless selenium executions
* Change working directory to /usr/local/
* update and upgrade the base image
* install nodejs v12 and npm
* copy all repository content into the docker image
* install dependencies by running npm install
* run tests


&nbsp;

### Manual Test Cases 
* The "SUP-Test Plan.xlsx" file contains the detailed information covered by the manual testing over the UCP functionalities.  
* These test scenarios are not being covered by the automation test code.
* It must be imperative to execute them as soon as exist a new version of the UCP application on early environments (Not Prod Env).
* Please take into consideration to execute the SMS notification feature carefully, be careful with automatic SMS generation.  
* For SMS testing is mandatory to have a US phone number in order to avoid wrong broadcasting.
* From the automation side, the Graph feature is covered a 50%, the graph bars were not covered by automation it must be tested manually.

&nbsp;

****





