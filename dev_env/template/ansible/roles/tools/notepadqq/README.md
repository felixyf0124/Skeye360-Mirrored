# notepadqq role

Installs the [nodepadqq](https://notepadqq.com/s/) text editor, a NotePad++ clone for Linux.

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/nodepadqq
```
