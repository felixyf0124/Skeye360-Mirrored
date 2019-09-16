# nuclide role

Installs nuclide in Atom (for ReactJS development).
Also installs Babel Globally (for Flow).

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/nuclide
```
