// Configure system

import jenkins.model.*
import org.jenkinsci.plugins.workflow.libs.SCMSourceRetriever
import org.jenkinsci.plugins.workflow.libs.LibraryConfiguration
import jenkins.plugins.git.GitSCMSource

def setupEmail() {
    def desc = Jenkins.instance.getDescriptor("hudson.tasks.Mailer")

//    desc.setSmtpAuth("[SMTP user]", "[SMTP password]")
    desc.setReplyToAddress("no-reply")
    desc.setSmtpHost("se-smtp.ericsson.se")
    desc.setUseSsl(false)
//    desc.setSmtpPort("[SMTP port]")
    desc.setCharset("UTF-8")

    desc.save()
}

// Source: https://stackoverflow.com/questions/40568225/configure-jenkins-global-pipeline-library-via-groovy
def setupGlobalPipelineLibrary(libraryName, gitRepoUrl) {
    def globalLibsDesc = Jenkins.getInstance()
            .getDescriptor("org.jenkinsci.plugins.workflow.libs.GlobalLibraries")

    SCMSourceRetriever retriever = new SCMSourceRetriever(new GitSCMSource(
            libraryName,
            gitRepoUrl,
            "",
            "*",
            "",
            false))

    LibraryConfiguration libraryConfiguration = new LibraryConfiguration(libraryName, retriever)
//            .setDefaultVersion(env.BRANCH_NAME)
//            .setImplicit(true)

    globalLibsDesc.get().setLibraries([libraryConfiguration])
}

println("Setting master number of executors")

// Don't use master to run jobs
Jenkins.instance.setNumExecutors(0)

setupEmail()
setupGlobalPipelineLibrary("jenkins-ci-lib", "/jenkins-ci-lib")
