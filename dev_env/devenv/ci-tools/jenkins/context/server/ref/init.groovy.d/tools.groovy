/*
The trick here was to manually add a global tool configuration, then look in the jenkins configuration files
where the tool was defined.  The XML then contains the name of the classes being used, in this case GitTool.
The rest was googling for hudson.plugins.git.GitTool and look at the source code for the ToolDescriptor stuff.
 */
import jenkins.model.*
import hudson.plugins.git.GitTool

def addGitTool(String name, String pathToGit) {
    def descriptor = Jenkins.instance.getDescriptor("hudson.plugins.git.GitTool")

    GitTool[] installations = descriptor.getInstallations()

    if (installations.find { i -> i.name == name } == null) {
        installations += new GitTool(name, pathToGit, null)
        descriptor.setInstallations(installations)
    }
}

addGitTool("git-js", "git")
