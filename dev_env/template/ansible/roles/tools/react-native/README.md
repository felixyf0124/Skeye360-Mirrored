# react-native role

__WARNING__ This role is in development and is not ready to be used at large.

Installs [react-native](https://facebook.github.io/react-native/) to build iOS and Android
applications.  All the installation steps for building android apps on Linux, from the
[getting started](https://facebook.github.io/react-native/docs/getting-started) page, are done,
except for the steps that involve starting android-studio and downloading the various SDK
components.  Start android-studio and do these steps manually.

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/react-native
```
