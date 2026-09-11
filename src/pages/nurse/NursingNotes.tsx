import { FileText, Save, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const recentNotes = [
  { id: 1, patient: 'John Smith', noteType: 'Progress Note', date: '2026-09-10 09:30', nurse: 'Nurse Sarah', notes: 'Patient vitals stable. Post-surgical wound clean and dry. No signs of infection.' },
  { id: 2, patient: 'Sarah Johnson', noteType: 'Critical Note', date: '2026-09-10 08:45', nurse: 'Nurse Sarah', notes: 'Patient vitals showing signs of deterioration. BP elevated. Notified doctor.' },
  { id: 3, patient: 'Mike Williams', noteType: 'Progress Note', date: '2026-09-10 08:00', nurse: 'Nurse Michael', notes: 'Blood sugar levels within normal range. Patient compliant with insulin schedule.' },
  { id: 4, patient: 'Emily Brown', noteType: 'Discharge Note', date: '2026-09-10 07:30', nurse: 'Nurse Sarah', notes: 'Patient recovering well. Ready for discharge with follow-up in 2 weeks.' },
  { id: 5, patient: 'David Lee', noteType: 'Assessment Note', date: '2026-09-10 07:00', nurse: 'Nurse Michael', notes: 'Neurological assessment shows improvement. Patient able to move extremities.' },
  { id: 6, patient: 'Lisa Anderson', noteType: 'Progress Note', date: '2026-09-09 22:00', nurse: 'Nurse Sarah', notes: 'Respiratory rate slightly elevated. Monitoring oxygen levels closely.' },
  { id: 7, patient: 'James Wilson', noteType: 'Critical Note', date: '2026-09-09 21:30', nurse: 'Nurse Michael', notes: 'Patient experiencing severe pain. Administered PRN medication. Pain level decreased from 9 to 6.' },
  { id: 8, patient: 'Maria Garcia', noteType: 'Progress Note', date: '2026-09-09 21:00', nurse: 'Nurse Sarah', notes: 'Post-operative recovery progressing well. Patient ambulating with assistance.' },
];

const noteTypeColors: Record<string, string> = {
  'Progress Note': 'bg-blue-100 text-blue-800',
  'Critical Note': 'bg-red-100 text-red-800',
  'Discharge Note': 'bg-green-100 text-green-800',
  'Assessment Note': 'bg-purple-100 text-purple-800',
};

export default function NursingNotes() {
  return (
    <div className="space-y-6">
      <PageHeader title="Nursing Notes" description="Document and manage nursing notes" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            New Nursing Note
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select Patient</option>
                <option>John Smith (PAT001)</option>
                <option>Sarah Johnson (PAT002)</option>
                <option>Mike Williams (PAT003)</option>
                <option>Emily Brown (PAT004)</option>
                <option>David Lee (PAT005)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select Note Type</option>
                <option>Progress Note</option>
                <option>Critical Note</option>
                <option>Discharge Note</option>
                <option>Assessment Note</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                rows={6}
                placeholder="Enter your nursing notes..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4" />
              Save Note
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Notes
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Note Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nurse</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{note.patient}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${noteTypeColors[note.noteType]}`}>
                        {note.noteType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{note.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{note.nurse}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}