import pathlib
from xml.etree import ElementTree as ET

DEFAULT_TREE = r'''<?xml version="1.0" encoding="UTF-8"?>

<samplemap ID="" RRGroupAmount="4" MicPositions=";">
</samplemap>
'''


class SampleMapParser(object):
    STANDARD_TUNING = (64, 59, 55, 50, 45, 40)

    def __init__(self, file, string=1, **kwargs):
        self.file = pathlib.Path(file)
        self.folder_path = file.parent
        self.string_index = string
        self.debug = kwargs.get('debug', False)
        try:
            self.tree = ET.parse(file)
        except (FileNotFoundError, ET.ParseError):
            self.root = ET.fromstring(DEFAULT_TREE)
            self.tree = ET.ElementTree(self.root)
        else:
            self.root = self.tree.getroot()
        self.samples = self.tree.findall('sample')
        self.tuning = kwargs.get('tuning', self.STANDARD_TUNING)

    def __call__(self, func, **kwargs):
        for each_sample in self.samples:
            if filter := kwargs.get('filter', None):
                if not filter(each_sample):
                    continue
            try:
                getattr(self, func)(each_sample, **kwargs)
            except TypeError:
                for each_func in func:
                    getattr(self, each_func)(each_sample, **kwargs)
            if self.debug:
                print(each_sample.attrib)
                break
        if self.debug:
            return
        if kwargs.get('debug', False):
            map(lambda x: print(x.attrib), self.samples)
            return
        self.write()

    def _get_value(self, arg, key, default, **kwargs):
        return str(
            func(arg) if (func := kwargs.get(f'{key}Func', None))
            else kwargs.get(key, default)
        )

    def write(self):
        ET.indent(self.tree)
        self.tree.write(self.file)

    def set_id(self, IDFunc):
        self.root.set('ID', IDFunc(self.file))

    def transpose(self, sample, interval, **kwargs):
        for each_key in ('Root', 'LoKey', 'HiKey'):
            oldmidi = int(sample.attrib[each_key])
            newmidi = oldmidi + interval
            sample.set(each_key, str(newmidi))

    def add_microphone(self, sample, number, **kwargs):
        filename = sample.attrib['FileName']
        sample.set('FileName', f'{filename[:-5]}{number}{filename[-4:]}')

    def set_velocity(self, sample, LoVel=1, HiVel=127, **kwargs):
        lovel = sample.attrib['LoVel']
        lovel = self._get_value(int(lovel), 'LoVel', LoVel, **kwargs)
        hivel = sample.attrib['HiVel']
        hivel = self._get_value(int(hivel), 'HiVel', HiVel, **kwargs)
        sample.set('LoVel', lovel)
        sample.set('HiVel', hivel)

    def set_rr(self, sample, RRGroup=1, **kwargs):
        rr_value = sample.attrib['RRGroup']
        rr_value = self._get_value(int(rr_value), 'RRGroup', RRGroup, **kwargs)
        sample.set('RRGroup', rr_value)

    def add_sample(self, **kwargs):
        child = ET.Element("sample")
        child.attrib['Root'] = str(kwargs.get('Root'))
        child.attrib['LoKey'] = str(kwargs.get('LoKey'))
        child.attrib['HiKey'] = str(kwargs.get('HiKey'))
        child.attrib['LoVel'] = str(kwargs.get('LoVel'))
        child.attrib['HiVel'] = str(kwargs.get('HiVel'))
        child.attrib['RRGroup'] = str(kwargs.get('RRGroup'))
        child.attrib['FileName'] = str(kwargs.get('FileName'))
        child.attrib['Volume'] = str(kwargs.get('Volume'))
        self.root.append(child)

    def relocate(self, sample, **kwargs):
        filename = sample.attrib['FileName']
        filename = self._get_value(filename, 'FileName', filename, **kwargs)
        sample.set('FileName', filename)

    def remove(self, sample, **kwargs):
        self.root.remove(sample)
