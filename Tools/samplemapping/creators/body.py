import re
from . import SampleKeyCreator


class BodySampleKeyCreator(SampleKeyCreator):
    SUSTAIN = r'01_{index}_s{dir}_{fret}_{dyn}'
    
    VIBRATO = r'String{index}/Vibrato/02_{index}_svdf_{fret:02d}_{rr}-{mic}'
    RE_VIBRATO = re.compile(r'String(?P<Index>\d)/Vibrato/02_\d_svdf_(?P<Fret>\d+)')
    NHARM = r'String{index}/Harmonic/600_{index}_nharm_{fret:02d}_{rr}-{mic}'
    NHARMSH = r'String{index}/Harmonic/600_{index}_nharm_sh_{rr}-{mic}'
    RE_NHARM = re.compile(r'String(?P<Index>\d)/Harmonic/600_\d_nharm_(?P<Fret>..)')
    CHORD = r'String{index}/Chord {dir_str}/01_{index}_s{dir}chd{loud}_{fret:02d}_{rr:02d}-{mic}'
    RE_CHORD = re.compile(r'String(?P<Index>\d)/Chord (Down|Up)/01_\d_s.chd[ld]*_(?P<Fret>\d+)_')

    def __init__(self):
        super().__init__(filename='Body.xml')

    def vibrato(self, index, parser):
        for fret in range(1, 21):
            for rr in range(1, 4):
                parser.add_sample(
                    FileName=self.PREFIX+self.VIBRATO.format(index=index, fret=fret, rr=rr, mic=2),
                    re_parser=self.RE_VIBRATO,
                    LoVel=rr+80,
                    HiVel=rr+80,
                    RRGroup=2
                )
    
    def nharm(self, index, parser):
        frets = [3, 5, 7, 9, 12, 19, 'sh']
        for i, fret in enumerate(frets):
            for rr in range(1, 3):
                try:
                    filename=self.PREFIX+self.NHARM.format(index=index, fret=fret, rr=rr, mic=2)
                except ValueError:
                    filename=self.PREFIX+self.NHARMSH.format(index=index, rr=rr, mic=2)
                parser.add_sample(
                    FileName=filename,
                    re_parser=self.RE_NHARM,
                    Root=i,
                    LoKey=i,
                    HiKey=i,
                    LoVel=rr,
                    HiVel=rr,
                )

    def chord(self, index, parser):
        for d in ('d', 'u'):
            for fret in range(0, 21):
                for rr in range(1, 6):
                    parser.add_sample(
                        FileName=self.PREFIX+self.CHORD.format(
                            index=index, dir_str='Down' if d == 'd' else 'Up', dir=d, fret=fret, loud="", rr=rr, mic=2
                            )+'.wav',
                        re_parser=self.RE_CHORD,
                        LoVel=rr+(115 if d == 'u' else 105),
                        HiVel=rr+(115 if d == 'u' else 105),
                        Volume=4 if index == 1 and fret == 2 else 2,
                    )
            for fret in range(0, 21):
                for rr in range(1, 6):
                    volume = 2
                    loud = ''
                    if index == 1:
                        if fret <= 5:
                            volume = 0
                            loud = 'ld'
                        if fret == 2:
                            volume = -1
                    else:
                        volume = 2

                    parser.add_sample(
                        FileName=self.PREFIX+self.CHORD.format(
                            index=index, dir_str='Down' if d == 'd' else 'Up', dir=d, fret=fret, loud=loud, rr=rr, mic=2
                            )+'.wav',
                        re_parser=self.RE_CHORD,
                        LoVel=rr+(110 if d == 'u' else 100),
                        HiVel=rr+(110 if d == 'u' else 100),
                        Volume= volume,
                    )