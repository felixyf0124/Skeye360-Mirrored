1.Open up a Terminal
2.Navigate to the sonarqube folder (under the project folder)
3.Type: docker-compose up
4.Open a browser and type: localhost:9000

P.S: Use docker-compose in the local VM only, not for the cloud VM
To analyze the project locally:
1.Clone your branch into the local VM
2.Navigate to the root of the project
3.Modify the sonar-project.properties to your own settings and then, save it
4.Open a terminal and navigate to the root of the project
5.Type: sonar-scanner
6.After the scan have been completed, open a browser and go to localhost:9000
