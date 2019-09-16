# watchman role

Installs [watchman](https://facebook.github.io/watchman/), a file watching service.

## Role Variables

See [defaults](defaults/main.yml) for role defaults for these variables.

### watchman_version

The version to install.

## Example Playbook

To install the default version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/watchman
```

To install a specific version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - { role: tools/watchman, watchman_version: "4.9.0" }
```
