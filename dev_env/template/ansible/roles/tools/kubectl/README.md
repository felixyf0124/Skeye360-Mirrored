# kubectl role

This role installs the kubernetes 'kubectl' utility for system-wide use.

It also sets up the following extra features in the user's .bashrc file:

* kubectl bash shell completion
* Automatic management of KUBECONFIG variable (see below)

## Automatic management of KUBECONFIG

This role installs a script `/usr/local/bin/setup-kubeconfig.sh`
and sources it from the user's .bashrc file.  This script automatically
sets the value of the KUBECONFIG variable with all the files it finds in the directory `~/.kube/configs/`, plus the default config file `~/.kube/config`.

When working with multiple clusters, simply copy each cluster's
config file to `~/.kube/configs/`.  To apply the changes, either start a
new shell or issue `. ~/.bashrc`.  You can then list all available cluster
contexts with  `kubectl config get-contexts`.

## Role Variables

### kubectl_version

Version of kubectl to install.  The version must match exactly the version
scheme used in the kubernetes PPA repository, for example "1.12.3-00".

The default is "*" meaning get the latest version available in the repository.


## Example Playbook

To install the latest version of kubectl:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/kubectl
```

To install a specific version of kubectl:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - { role: tools/kubectl, kubectl_version: "1.12.3-00" }
```
