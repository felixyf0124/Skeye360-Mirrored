# wireshark role

Installs wireshark and configure it so it can be executed without
being root.

## Role Variables

See [defaults](defaults/main.yml) for role defaults for these variables.

### username

The user to configure so he can capture packets without being root.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/wireshark
```
