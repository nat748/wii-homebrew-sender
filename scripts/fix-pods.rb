# Post-install hook to fix Swift strict concurrency errors on Xcode 16+
# Injected into Podfile after expo prebuild
def fix_pods_post_install(installer)
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
      config.build_settings['SWIFT_TREAT_WARNINGS_AS_ERRORS'] = 'NO'
      config.build_settings['GCC_TREAT_WARNINGS_AS_ERRORS'] = 'NO'
    end
  end
end
