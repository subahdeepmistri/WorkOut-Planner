import React from 'react';
import {
    ChevronLeft, ChevronRight, Plus, Trash2, Save, History,
    Dumbbell, Link, X, Calendar, BarChart2, Edit2, Check,
    Play, Pause, RotateCcw, Lock, Unlock
} from 'lucide-react';

export const Icons = {
    ChevronLeft: (props) => <ChevronLeft {...props} />,
    ChevronRight: (props) => <ChevronRight {...props} />,
    Plus: (props) => <Plus {...props} />,
    Trash: (props) => <Trash2 {...props} />,
    Save: (props) => <Save {...props} />,
    History: (props) => <History {...props} />,
    Dumbbell: (props) => <Dumbbell {...props} />,
    Link: (props) => <Link {...props} />,
    X: (props) => <X {...props} />,
    Calendar: (props) => <Calendar {...props} />,
    Chart: (props) => <BarChart2 {...props} />,
    Edit: (props) => <Edit2 {...props} />,
    Check: (props) => <Check {...props} />,
    Play: (props) => <Play {...props} />,
    Pause: (props) => <Pause {...props} />,
    Reset: (props) => <RotateCcw {...props} />,
    Lock: (props) => <Lock {...props} />,
    Unlock: (props) => <Unlock {...props} />
};
