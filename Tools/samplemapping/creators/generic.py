import pathlib
import re
from . import SampleMapCreator


class GenericSampleMapCreator(SampleMapCreator):
    TYPE = r'Generic'
    STRUMNOISE = r'130_brpn{dir}{stroke}_{dyn}_{fret:02d}_{rr}'
    STRUMNOISEHM = r'130_6_brpn{dir}hm_{dyn}_{fret:02d}_{rr}'
    SLOWSTRUMNOISE = r'130_{stroke}_brpn{dir}_{dyn}_{fret:02d}_{rr}'

    def __init__(self, project_path, **kwargs):
        super().__init__(pathlib.Path(project_path) / f'{self.TYPE}.xml')

    def strum_noise(self):
        def get_volume(fret, **kwargs):
            dyn_index = kwargs.get('dyn_index')
            if dyn_index:
                return 3.2

            dir_index = kwargs.get('dir_index')
            stroke = kwargs.get('stroke')
            if stroke == 'lw':
                if dir_index:
                    return -2.5 if fret > 4 else -2
                return -1 if fret > 4 else 0
            return 0

        for each_comb in self.get_all_samples(
            (
                self.for_multiple_strokes,
                self.for_both_direction,
                self.for_multiple_frets,
                self.for_multiple_dynamics,
                self.for_multiple_rr
            ),
            strokes=('hm', 'lw', 'up'),
            frets=range(1, 11),
            dyns=('loud', 'mid'),
            rrs=5,
        ):
            self.add_sample(
                **each_comb,
                type=self.TYPE,
                string='',
                articulation='Extra Strum Noise',
                tempstr=(
                    self.STRUMNOISEHM if each_comb['stroke'] == 'hm'
                    else self.STRUMNOISE
                ),
                LoKeyFunc=lambda f, b, **kwargs: b if f < 1 else f + b,
                HiKeyFunc=lambda f, b, **kwargs: b + 20 if f >= 10 else f,
                VolumeFunc=get_volume
            )

    def slow_strum_noise(self):
        def get_volume(fret, **kwargs):
            dyn_index = kwargs.get('dyn_index')
            if dyn_index:
                return 3.2
            return 0

        for each_comb in self.get_all_samples(
            (
                self.for_multiple_strokes,
                self.for_both_direction,
                self.for_multiple_frets,
                self.for_multiple_dynamics,
                self.for_multiple_rr
            ),
            strokes='65',
            frets=range(1, 12),
            dyns=('loud', 'mid'),
            rrs=5,
        ):
            self.add_sample(
                **each_comb,
                type=self.TYPE,
                string='',
                articulation='Extra Slow Strum Noise',
                tempstr=self.SLOWSTRUMNOISE,
                vel_offset=60,
                LoKeyFunc=lambda f, b, **kwargs: b if f < 1 else f + b,
                HiKeyFunc=lambda f, b, **kwargs: b + 20 if f >= 11 else f,
                VolumeFunc=get_volume
            )

    def position_change(self):
        tempstr = r'135_{stroke}_pchnage{dyn}_{fret:02d}_{rr}'

        for each_comb in self.get_all_samples(
            (
                self.for_multiple_strokes,
                self.for_multiple_frets,
                self.for_multiple_dynamics,
                self.for_multiple_rr
            ),
            strokes='65',
            dyns=('_ld', ''),
            frets=range(1, 11),
            rrs=5,
        ):
            self.add_sample(
                **each_comb,
                type=self.TYPE,
                string='',
                articulation='Position Change',
                tempstr=tempstr,
                vel_offset=110,
                LoKeyFunc=lambda f, b, **kwargs: b if f < 1 else f + b,
                HiKeyFunc=lambda f, b, **kwargs: b + 20 if f >= 10 else f,
            )

    def muted_strum_noise(self):
        tempstr = r'135_mbrsh_E_{dyn}_{rr}'
        for each_comb in self.get_all_samples(
            (
                self.for_multiple_dynamics,
                self.for_multiple_rr
            ),
            dyns=('loud', 'soft'),
            rrs=7,
        ):
            self.add_sample(
                **each_comb,
                type=self.TYPE,
                string='',
                articulation='Muted Strum Noise',
                tempstr=tempstr,
                Root=0,
                LoKey=0,
                HiKey=0,
            )

    def bridge_mute_noise(self):
        def get_volume(**kwargs):
            return (0, 3.2, 11.2)[kwargs.get('dyn_index', 0)]

        tempstr = r'135_bm{dyn}_{rr}'

        for each_comb in self.get_all_samples(
            (
                self.for_multiple_dynamics,
                self.for_multiple_rr
            ),
            dyns=('_hard', '', '_soft'),
            rrs=5,
        ):
            self.add_sample(
                **each_comb,
                type=self.TYPE,
                string='',
                articulation='Bridge Mute Noise',
                tempstr=tempstr,
                Root=1,
                LoKey=1,
                HiKey=1,
                VolumeFunc=get_volume
            )

    def palm_hit(self):
        tempstr = r'135_perc_hlcnplm2_{dyn}_{rr}'
        for each_comb in self.get_all_samples(
            (
                self.for_multiple_dynamics,
                self.for_multiple_rr
            ),
            dyns=('ld', 'mdh', 'md'),
            rrs=5,
        ):
            self.add_sample(
                **each_comb,
                type=self.TYPE,
                string='',
                articulation='Palm Hit',
                tempstr=tempstr,
                Root=2,
                LoKey=2,
                HiKey=2,
            )

    def finger_hit(self):
        tempstr = r'135_perc_flwtrpfq{stroke}_{dyn}_{rr}'
        for each_comb in self.get_all_samples(
            (
                self.for_multiple_strokes,
                self.for_multiple_dynamics,
                self.for_multiple_rr
            ),
            strokes=('n', '', '2'),
            dyns=('ld', 'qt'),
            rrs=5,
        ):
            self.add_sample(
                **each_comb,
                type=self.TYPE,
                string='',
                articulation='Finger Hit',
                tempstr=tempstr,
                Root=3,
                LoKey=3,
                HiKey=3,
            )

    def string_mute_buzz(self):
        tempstr = r'135_perc_strhit_{dyn}_{rr}'

        for each_comb in self.get_all_samples(
            (
                self.for_multiple_dynamics,
                self.for_multiple_rr
            ),
            dyns=('ld2', 'ld', 'md', 'qt'),
            rrs=5,
        ):
            self.add_sample(
                **each_comb,
                type=self.TYPE,
                string='',
                articulation='String Mute Buzz',
                tempstr=tempstr,
                Root=4,
                LoKey=4,
                HiKey=4,
            )

    def pickguard_hit(self):
        tempstr = r'135_pkgdhit_{dyn}_{rr}'
        for each_comb in self.get_all_samples(
            (
                self.for_multiple_dynamics,
                self.for_multiple_rr
            ),
            dyns='12',
            rrs=12,
        ):
            self.add_sample(
                **each_comb,
                type=self.TYPE,
                string='',
                articulation='Pickguard Hit',
                tempstr=tempstr,
                Root=5,
                LoKey=5,
                HiKey=5,
            )
