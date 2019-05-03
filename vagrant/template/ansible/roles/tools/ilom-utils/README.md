# ilom-utils role

Installs /home/{{username}}/tools/ilom-utils.  This contains utilities to help
connect to ILOM consoles, such as those available on ccvh
machines.  It consists of a java installation with security
settings turned off, and a small script to help connect
to ILOM.


## Role Variables

### username

The user account name in which to install the utilities.


## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/ilom-utils
```
