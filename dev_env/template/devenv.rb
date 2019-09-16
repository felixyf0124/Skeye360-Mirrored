require 'yaml'
require 'vagrant/util/platform'

$vboxmanage_exe = "vboxmanage"
if Vagrant::Util::Platform.wsl?
    $vboxmanage_exe = "VBoxManage.exe"
end

def which(cmd)
    exts = ENV['PATHEXT'] ? ENV['PATHEXT'].split(';') : ['']
    ENV['PATH'].split(File::PATH_SEPARATOR).each do |path|
      exts.each { |ext|
        exe = File.join(path, "#{cmd}#{ext}")
        return exe if File.executable?(exe) && !File.directory?(exe)
      }
    end
    return nil
end

def check_proxy_variables()
    if ENV.keys.grep(/proxy/i).any?
        puts "WARNING: You seem to have proxy environment variables defined."
        puts "   If you get download errors, please remove these variables"
        puts "   from your environment: "
        puts ENV.keys.grep(/proxy/i)
    end
end

def is_valid_environment()
    is_valid = true

    if ! ensure_plugins([
        { :name => "vagrant-vbguest", :version => ">= 0.16.0" },
        { :name => "vagrant-disksize", :version => ">= 0.1.3" }])
        is_valid = false
    end

    #if ! Vagrant::Util::Platform.wsl?
        # There's a bug in newer versions that makes vagrant hang on first run.
        # The solution is to upgrade powershell, so make sure powershell is
        # at least version 3.
    #    powershell_version=`powershell (get-host).version.major`

    #    if (powershell_version.to_i < 3)
    #        puts "Invalid powershell version.  Please upgrade powershell.  Go here"
    #        puts "and install Windows Management Framework 3.0."
    #        puts "https://www.microsoft.com/en-us/download/details.aspx?id=34595"
    #        puts "Click Download and choose option: Windows6.1-KB2506143-x64.msu"
    #        puts "Then reboot to apply the changes."
    #        is_valid = false
    #    end
    #end
    
    if ! which($vboxmanage_exe)
        puts "Couldn't find 'vboxmanage' executable. Add virtualbox install directory to your PATH.  This is usually c:\\program files\\oracle\\virtualbox\\"
        is_valid = false
    end
  
    check_proxy_variables() # just a warning, so doesn't affect return value

    if ! File.exist?('vagrant.yml')
      FileUtils.copy('../template/vagrant.yml.template', 'vagrant.yml.template')
      puts "Rename vagrant.yml.template to vagrant.yml and set user-specific settings."
      is_valid = false
    end
    
    if ! File.exist?('playbook.yml')
      FileUtils.copy('../template/playbook.yml.template', 'playbook.yml.template')
      puts "Rename playbook.yml.template to playbook.yml and set the roles you need."
      is_valid = false
    end
    
    return is_valid
end

def load_settings(settings_file)
    settings = YAML.load_file settings_file

    # Set settings defaults
    
    settings['user'] ||= {}
    settings['user']['name'] ||= "vagrant"
    settings['user']['email'] ||= "vagrant@nowhere.com"
    
    settings['vm'] ||= {}
    settings['vm']['cpus'] ||= 2
    settings['vm']['memory'] ||= 1024
    settings['vm']['disksize'] ||= 100
    settings['vm']['cpuexecutioncap'] ||= 100
    settings['vm']['mounts'] ||= []
    settings['vm']['ports'] ||= []
    if settings['vm']['gui'] == nil
        settings['vm']['gui'] = true
    end
    
    settings['ssh'] ||= {}
    settings['ssh']['dir'] ||= nil
    
    settings['framework'] ||= {}
    settings['framework']['home'] ||= ".."
    settings['framework']['box_name'] ||= "ubuntu/bionic64"
    settings['framework']['box_disk_name'] ||= "ubuntu-bionic-18.04-cloudimg"
    settings['framework']['box_controller_name'] ||= "SCSI"
    settings['framework']['vdi_controller_name'] ||= "SCSI"
    if settings['framework']['create_vdi_controller'] == nil
        settings['framework']['create_vdi_controller'] = false
    end

    return settings
end

def vbox_get_vm_folder()
    # Find out where virtualbox stores the VMs
    systemsettings=`#{$vboxmanage_exe} list systemproperties`.split("\n")
    vm_folder_raw=systemsettings.find { |e| e =~ /Default machine folder/; }
    vm_home=vm_folder_raw[/Default machine folder:\s*(.*)$/, 1].gsub '\\', '/'

    return vm_home
end

def vagrant_get_vm_id()
    return File.read(".vagrant/machines/default/virtualbox/id")
end

def vbox_get_disk_path(vm_id)
    vminfo=`#{$vboxmanage_exe} showvminfo --machinereadable #{vm_id}`.split("\n")
    storage_controller_names=vminfo.find_all { |e| e =~ /^storagecontrollername/ }
    storage_controller_names.map! { |name| name.gsub(/storagecontrollername\d="(.*)"/, '\1') }
    storage_paths = vminfo.find_all { |name| name =~ /^"#{Regexp.escape(storage_controller_names[1])}-\d-\d"=".*(vdi|vmdk)"/;}
    disk_paths = storage_paths.map { |name| name.gsub!( /".*"="(.*)"/, '\1') }
    return disk_paths
end

# Ensures vagrant plugins are installed
#
# @param: plugins type: Array[Dict] desc: The desired plugins to install
def ensure_plugins(plugins)
    is_valid = true
    
    plugins.each do |plugin|
        if not Vagrant.has_plugin?(plugin[:name], plugin[:version])
          puts "#{plugin[:name]} #{plugin[:version]} is required. Please run `vagrant plugin install #{plugin[:name]}`"
          is_valid = false
        end
    end

    return is_valid
end
