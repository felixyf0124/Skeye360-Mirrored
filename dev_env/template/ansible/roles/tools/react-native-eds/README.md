# react-native-eds role

__WARNING__ This role is in development and is not ready to be used at large.

Installs [react-native](https://facebook.github.io/react-native/) to build iOS and Android
applications and Ericsson EDS resources.

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/react-native-eds
```
