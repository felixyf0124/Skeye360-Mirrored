import hudson.security.csrf.DefaultCrumbIssuer
import jenkins.model.Jenkins
import jenkins.security.s2m.*

// Configure global security
println("Configuring global security")

def j = Jenkins.instance

// Configure: Enable CLI over remoting
println("Configure: Enable CLI over remoting")

j.getDescriptor("jenkins.CLI").get().setEnabled(false)

// Configure: CSRF protection
// From: https://github.com/samrocketman/jenkins-bootstrap-shared/blob/master/scripts/configure-csrf-protection.groovy
println("Configure: CSRF protection")

if(j.getCrumbIssuer() == null) {
    j.setCrumbIssuer(new DefaultCrumbIssuer(true))
    j.save()
    println 'CSRF Protection configuration has changed.  Enabled CSRF Protection.'
}
else {
    println 'Nothing changed.  CSRF Protection already configured.'
}

/*
   Disable all JNLP protocols except for JNLP4.  JNLP4 is the most secure agent
   protocol because it is using standard TLS.

   From: https://github.com/samrocketman/jenkins-bootstrap-shared/blob/master/scripts/configure-jnlp-agent-protocols.groovy
 */
println("Configure: Agent protocols")

Set<String> agentProtocolsList = ['JNLP4-connect', 'Ping']
if(!j.getAgentProtocols().equals(agentProtocolsList)) {
    j.setAgentProtocols(agentProtocolsList)
    println "Agent Protocols have changed.  Setting: ${agentProtocolsList}"
    j.save()
}
else {
    println "Nothing changed.  Agent Protocols already configured: ${j.getAgentProtocols()}"
}

// Enable Agent to master security subsystem
println("Configure: Agent -> Master access control")
j.injector.getInstance(AdminWhitelistRule.class).setMasterKillSwitch(false);