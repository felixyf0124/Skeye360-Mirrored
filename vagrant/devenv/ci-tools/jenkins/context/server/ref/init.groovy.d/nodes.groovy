// From: https://support.cloudbees.com/hc/en-us/articles/218154667-Create-a-Permanent-Agent-from-Groovy-Console

import hudson.model.*
import jenkins.model.*
import hudson.slaves.*
import hudson.slaves.EnvironmentVariablesNodeProperty.Entry
import hudson.plugins.sshslaves.SSHLauncher
import hudson.plugins.sshslaves.verifiers.*

// Pick one of the strategies from the comments below this line
//SshHostKeyVerificationStrategy hostKeyVerificationStrategy = new KnownHostsFileKeyVerificationStrategy()
//SshHostKeyVerificationStrategy hostKeyVerificationStrategy = new KnownHostsFileKeyVerificationStrategy() // Known hosts file Verification Strategy
//SshHostKeyVerificationStrategy hostKeyVerificationStrategy = new ManuallyProvidedKeyVerificationStrategy("<your-key-here>") // Manually provided key Verification Strategy
//SshHostKeyVerificationStrategy hostKeyVerificationStrategy = new ManuallyTrustedKeyVerificationStrategy(false /*requires initial manual trust*/) // Manually trusted key Verification Strategy
SshHostKeyVerificationStrategy hostKeyVerificationStrategy = new NonVerifyingKeyVerificationStrategy() // Non verifying Verification Strategy

// Define a "Launch method": "Launch slave agents via SSH"
ComputerLauncher launcher = new SSHLauncher(
        "slave", // Host ip or name
        22, // Port
        "root", // Credentials
        (String)null, // JVM Options
        (String)null, // JavaPath
        (String)null, // Prefix Start Slave Command
        (String)null, // Suffix Start Slave Command
        (Integer)null, // Connection Timeout in Seconds
        (Integer)null, // Maximum Number of Retries
        (Integer)null, // The number of seconds to wait between retries
        hostKeyVerificationStrategy // Host Key Verification Strategy
)

// Define a "Permanent Agent"
Slave agent = new DumbSlave(
        "slave",
        "/workspace",
        launcher)
agent.nodeDescription = "slave"
agent.numExecutors = 1
agent.labelString = "build"
agent.mode = Node.Mode.NORMAL
agent.retentionStrategy = new RetentionStrategy.Always()

//List<Entry> env = new ArrayList<Entry>();
//env.add(new Entry("key1","value1"))
//env.add(new Entry("key2","value2"))
//EnvironmentVariablesNodeProperty envPro = new EnvironmentVariablesNodeProperty(env);
//
//agent.getNodeProperties().add(envPro)

Jenkins.instance.addNode(agent)
