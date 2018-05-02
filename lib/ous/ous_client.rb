module Ous
  class OusClient < BaseClient
    def get_coverage(params, format = 'nc')
      default_params = {
        format: format
      }

      get('', default_params.merge(params))
    end
  end
end