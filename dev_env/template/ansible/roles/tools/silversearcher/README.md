# silversearcher role

Installs [SilverSearcher (AG)](https://github.com/ggreer/the_silver_searcher/blob/master/README.md).

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/silversearcher
```
