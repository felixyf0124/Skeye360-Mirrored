# auto-apm role

Install the [auto-apm](https://www.npmjs.com/package/auto-apm) utilty, related to Atom
editor package installation.

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/auto-apm
```
