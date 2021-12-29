import itertools
import re
from ..parser import SampleMapParser


STRINGS = ('String1', 'String2', 'String3', 'String4', 'String5', 'String6')

ARTICULATIONS = {
    'Sustain Down': '_sd_',
    'Sustain Up': '_su_',
    'Muted Down': '_mdm_',
    'Muted Up': '_mum_',
    'Chord Down': '_sdchd',
    'Chord Up': '_suchd',
    'Vibrato': '_svdf_',
    'Harmonic': '_nharm_',
    'Fret Noise Down': '_fnd_',
    'Fret Noise Up': '_fnu_',
    'Finger Release': '_frn_',
    'Pick Buzz Down': '_pkbz_d',
    'Pick Buzz Up': '_pkbz_u',
    'Pick Noise Down': '_pnd_',
    'Pick Noise Up': '_pnu_',
    'Pick Stop': '_pstop_',
    'Glide Down': '_sgdwn_',
}


def _iter_factors(factors, prod=1, sum=0):
    try:
        factor = factors.pop(0)
    except IndexError:
        return sum
    else:
        sum += prod * factor[1]
        prod *= factor[0]
        sum = _iter_factors(factors, prod, sum)
    return sum


class SampleMapCreator(object):
    FILENAME = r'{{PROJECT_FOLDER}}{type}/{string}{articulation}/{filename}-{mic}.wav'
    RE_EMPTY = re.compile(r'')

    def __init__(self, filepath, **kwargs):
        self.parser = SampleMapParser(filepath, **kwargs)

    def __call__(self, func, **kwargs):
        getattr(self, func)(**kwargs)
        self.parser.write()

    def _get_value(self, key, default, *args, **kwargs):
        try:
            value = kwargs.get(f'{key}Func')(*args, **kwargs)
        except TypeError:
            value = kwargs.get(key, default)
        finally:
            return str(value)

    def add_sample(self, **kwargs):
        params = []
        for param in ('rr', 'dyn', 'dir', 'stroke'):
            params.append(
                (
                    kwargs.get(f'total_{param}s', 1),
                    kwargs.get(f'{param}_index', 0)
                )
            )
        vel = self.get_velocity(params) + kwargs.get('vel_offset', 0)

        fret = kwargs.get('fret', 0)
        open_note = self.parser.tuning[self.parser.string_index]
        midinum = kwargs.get('midinum', open_note + fret)
        root = self._get_value('Root', midinum, fret, open_note, **kwargs)
        lo_key = self._get_value('LoKey', midinum, fret, open_note, **kwargs)
        hi_key = self._get_value('HiKey', midinum, fret, open_note, **kwargs)
        lo_vel = self._get_value('LoVel', vel, **kwargs)
        hi_vel = self._get_value('HiVel', vel, **kwargs)
        volume = self._get_value('Volume', 0, **kwargs)

        self.parser.add_sample(
            FileName=self.get_filename(
                type=kwargs.get('type'),
                string=kwargs.get('string'),
                articulation=kwargs.get('articulation'),
                mic=2,
                filename=kwargs.get('tempstr').format(
                    dir=kwargs.get('dir', ''),
                    stroke=kwargs.get('stroke', ''),
                    dyn=kwargs.get('dyn', ''),
                    fret=kwargs.get('fret', ''),
                    rr=kwargs.get('rr_index', '')
                )
            ),
            fret=fret,
            Root=root,
            LoKey=lo_key,
            HiKey=hi_key,
            LoVel=lo_vel,
            HiVel=hi_vel,
            RRGroup=kwargs.get('RRGroup', 1),
            Volume=volume
        )

    def get_articulation_name(self, filename):
        for k, v in ARTICULATIONS.items():
            if v in filename:
                return k
        return 'Global'

    def get_filename(self, **kwargs):
        return self.FILENAME.format(**kwargs)

    def get_velocity(self, params):
        return _iter_factors(params)

    def get_all_samples(self, funcs, **kwargs):
        params = {}
        for samples in itertools.product(*[func(**kwargs) for func in funcs]):
            for sample_property in samples:
                params.update(sample_property)
            yield params

    def for_multiple_strokes(self, strokes, **kwargs):
        return (
            dict(stroke_index=i, stroke=stroke, total_strokes=len(strokes))
            for i, stroke in enumerate(strokes)
        )

    def for_multiple_frets(self, frets, **kwargs):
        return (
            dict(fret_index=i, fret=fret)
            for i, fret in enumerate(frets)
        )

    def for_multiple_rr(self, rrs, **kwargs):
        return (
            dict(rr_index=rr+1, total_rrs=rrs) for rr in range(rrs)
        )

    def for_multiple_dynamics(self, dyns, **kwargs):
        return (
            dict(dyn_index=i, dyn=dyn, total_dyns=len(dyns))
            for i, dyn in enumerate(dyns)
        )

    def for_both_direction(self, **kwargs):
        return (
            dict(dir_index=d, dir='du'[d], total_dirs=2)
            for d in range(2)
        )
