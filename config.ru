require 'dugway'

options = {}

# Use data from any store to make sure your theme looks great with all sorts of products, pages,
# categories, and more. Just give us the subdomain. Default is "dugway" for dugway.bigcartel.com.
# options[:store] = 'testpicklejuice'


# Simulate the customization done by store owners by passing values to different variables.
# Default values are based on the "default" for each setting in your settings.json.
# options[:customization] = {
#   :logo => {
#     :url => 'http://placehold.it/200x50/000000/ffffff&text=My+Logo',
#     :width => 200,
#     :height => 50
#   },
#   :background_color => '#CCCCCC',
#   :show_search => true,
#   :twitter_username => 'mytwitter'
# }
options[:customization] = {
  slideshow: [
    { url: 'http://placehold.it/1440x800/ababab/ffffff&text=Slideshow image one', width: 1440, height: 800 },
    { url: 'http://placehold.it/1440x800/336699/ffffff&text=Slideshow image two', width: 1440, height: 800 },
    { url: 'http://placehold.it/1440x800/ff0000/ffffff&text=Slideshow image three', width: 1440, height: 800 }
  ]
}

run Dugway.application(options)
