from rest_framework.throttling import AnonRateThrottle

class AplllicationBurstThrottle(AnonRateThrottle):
    rate = '5/min'

    def get_cache_key(self, request, view):
        ident = self.get_ident(request)
        return self.cache_format % {
            'scope': 'application_burst',
            'ident': ident
        }


class ApplicationSustainedThrottle(AnonRateThrottle):
    rate = '30/hour'

    def get_cache_key(self, request, view):
        ident = self.get_ident(request)
        return self.cache_format % {
            'scope': 'application_burst',
            'ident': ident
        }