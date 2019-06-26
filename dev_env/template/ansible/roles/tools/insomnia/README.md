# insomnia role

Installs [insomnia REST client](https://insomnia.rest/)

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/insomnia
```
