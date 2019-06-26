# nodejs role

Installs [nodejs](https://nodejs.org/en/).

## Role Variables


## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/nodejs
```
