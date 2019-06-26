# vscode role

Installs [Visual Studio Code](https://code.visualstudio.com/).

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/vscode
```
