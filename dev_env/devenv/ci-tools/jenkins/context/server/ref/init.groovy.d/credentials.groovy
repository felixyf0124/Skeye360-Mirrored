// from: https://support.cloudbees.com/hc/en-us/articles/217708168-create-credentials-from-groovy

import com.cloudbees.plugins.credentials.impl.*
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.domains.*
import com.cloudbees.jenkins.plugins.sshcredentials.impl.*

Credentials c = new UsernamePasswordCredentialsImpl(CredentialsScope.GLOBAL, "root", "root login on jenkins slave", "root", "root")
SystemCredentialsProvider.getInstance().getStore().addCredentials(Domain.global(), c)



// from: https://github.com/Praqma/JenkinsAsCodeReference/blob/master/dockerizeit/master/credentials.groovy
String keyfile = "/usr/share/jenkins/ref/ssh/jnkbnet.id_rsa"

c = new BasicSSHUserPrivateKey(CredentialsScope.GLOBAL,
        "jnkbnet",
        "jnkbnet",
        new BasicSSHUserPrivateKey.FileOnMasterPrivateKeySource(keyfile),
        "",
        "BNET functional user")
SystemCredentialsProvider.getInstance().getStore().addCredentials(Domain.global(), c)
