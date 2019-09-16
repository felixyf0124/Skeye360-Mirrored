# firefox role

Installs the latest version of the firefox web browser.


## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/firefox
```
