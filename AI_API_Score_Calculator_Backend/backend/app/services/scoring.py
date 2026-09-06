DEFAULT_METRICS={'accuracy':94.0,'relevance':91.0,'quality':93.0,'reliability':98.0,'latency':87.0,'cost':82.0,'safety':96.0}
def calculate_weighted_score(weights,metrics=None):
    if abs(sum(weights.values())-100)>0.001: raise ValueError('Scoring weights must total exactly 100.')
    values=metrics or DEFAULT_METRICS
    return round(sum(values.get(k,0)*w/100 for k,w in weights.items()),1)
def get_metrics(): return DEFAULT_METRICS.copy()
