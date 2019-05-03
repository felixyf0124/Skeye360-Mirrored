# minikube role

Installs [minikube](https://kubernetes.io/docs/setup/minikube/) locally in the VM
using the "none" driver.

__WARNING__ This role is in development and is not generic enough
yet to be used in any VM.

## Role Variables

See [defaults](defaults/main.yml) for role defaults for these variables.

### minikube_version

The version of minikube to install.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/minikube
```
