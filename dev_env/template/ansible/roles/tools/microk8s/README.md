# microk8s role

Installs [microk8s](https://microk8s.io/).

__WARNING__ This role is in development.
It is not generic enough yet to be used in any VM.

## Role Variables

See [defaults](defaults/main.yml) for role defaults for these variables.

### microk8s_enable_istio

When "yes", enables istio on the microk8s installation.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/microk8s
```
