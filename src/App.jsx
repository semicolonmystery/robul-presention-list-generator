import React, { useState } from 'react'
import PizZip from 'pizzip'
import { saveAs } from 'file-saver'
import './App.css'

function App() {
  const [entries, setEntries] = useState([
    {
      id: Date.now(),
      dateFrom: '',
      dateTo: '',
      selectedDays: [],
      timeFrom: '08:00',
      timeTo: '14:00'
    }
  ])


  const daysOfWeek = [
    { value: 1, label: 'Pondělí' },
    { value: 2, label: 'Úterý' },
    { value: 3, label: 'Středa' },
    { value: 4, label: 'Čtvrtek' },
    { value: 5, label: 'Pátek' },
    { value: 6, label: 'Sobota' },
    { value: 0, label: 'Neděle' }
  ]

  const addEntry = () => {
    setEntries([...entries, {
      id: Date.now(),
      dateFrom: '',
      dateTo: '',
      selectedDays: [],
      timeFrom: '08:00',
      timeTo: '14:00'
    }])
  }

  const removeEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const updateEntry = (id, field, value) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ))
  }

  const toggleDay = (entryId, day) => {
    setEntries(entries.map(entry => {
      if (entry.id === entryId) {
        const selectedDays = entry.selectedDays.includes(day)
          ? entry.selectedDays.filter(d => d !== day)
          : [...entry.selectedDays, day]
        return { ...entry, selectedDays }
      }
      return entry
    }))
  }

  const generateDates = () => {
    const allDates = []

    entries.forEach(entry => {
      if (!entry.dateFrom || !entry.dateTo || entry.selectedDays.length === 0) {
        return
      }

      const startDate = new Date(entry.dateFrom)
      const endDate = new Date(entry.dateTo)
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay()
        
        if (entry.selectedDays.includes(dayOfWeek)) {
          const day = String(currentDate.getDate()).padStart(2, '0')
          const month = String(currentDate.getMonth() + 1).padStart(2, '0')
          const year = currentDate.getFullYear()
          
          allDates.push(`Datum: ${day}.${month}.${year}, ${entry.timeFrom} - ${entry.timeTo} hod.`)
        }

        currentDate.setDate(currentDate.getDate() + 1)
      }
    })

    return allDates
  }

  const generateDOCX = async () => {
    try {
      const dates = generateDates()
      
      if (dates.length === 0) {
        alert('Nejsou vybrány žádné platné datumy!')
        return
      }

      const templateResponse = await fetch('/template.docx')
      const templateArrayBuffer = await templateResponse.arrayBuffer()
      
      if (dates.length === 1) {
        // Single date - just generate one DOCX
        const zip = new PizZip(templateArrayBuffer)
        const doc = zip.file('word/document.xml').asText()
        const modifiedDoc = doc.replace(/Datum:/g, dates[0])
        zip.file('word/document.xml', modifiedDoc)
        const modifiedDocx = zip.generate({ type: 'blob' })
        saveAs(modifiedDocx, `Prezencni_listina_${new Date().getTime()}.docx`)
        alert('DOCX vygenerováno!')
        return
      }

      // Multiple dates - merge into one DOCX
      const templateZip = new PizZip(templateArrayBuffer)
      const documentXml = templateZip.file('word/document.xml').asText()
      
      // Extract the body content (everything between <w:body> tags)
      const bodyMatch = documentXml.match(/<w:body>([\s\S]*?)<\/w:body>/)
      if (!bodyMatch) {
        throw new Error('Could not find document body')
      }
      
      const bodyContent = bodyMatch[1]
      // Remove the last </w:sectPr> tag from the body content to get just the content
      const contentWithoutSectPr = bodyContent.replace(/<w:sectPr[\s\S]*?<\/w:sectPr>\s*$/, '')
      
      // Build merged document
      let mergedBodyContent = ''
      
      dates.forEach((dateStr, index) => {
        // Replace Datum: in the content
        let pageContent = contentWithoutSectPr.replace(/Datum:/g, dateStr)
        
        mergedBodyContent += pageContent
      })
      
      // Add back the section properties at the end
      const sectPrMatch = bodyContent.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/)
      if (sectPrMatch) {
        mergedBodyContent += sectPrMatch[0]
      }
      
      // Create new document XML
      const mergedDocumentXml = documentXml.replace(
        /<w:body>[\s\S]*?<\/w:body>/,
        `<w:body>${mergedBodyContent}</w:body>`
      )
      
      // Create new DOCX with merged content
      const mergedZip = new PizZip(templateArrayBuffer)
      mergedZip.file('word/document.xml', mergedDocumentXml)
      
      const mergedDocx = mergedZip.generate({ type: 'blob' })
      saveAs(mergedDocx, `Prezencni_listiny_${new Date().getTime()}.docx`)
      
      alert(`DOCX s ${dates.length} stránkami úspěšně vygenerováno!`)
    } catch (error) {
      console.error('Chyba při generování DOCX:', error)
      alert('Nastala chyba při generování DOCX: ' + error.message)
    }
  }

  return (
    <div className="app">
      <h1>Generátor prezenční listiny</h1>
      
      <div className="entries-container">
        {entries.map((entry, index) => (
          <div key={entry.id} className="entry-card">
            <div className="entry-header">
              <h3>Období #{index + 1}</h3>
              {entries.length > 1 && (
                <button 
                  className="remove-btn"
                  onClick={() => removeEntry(entry.id)}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Datum od:</label>
                <input
                  type="date"
                  value={entry.dateFrom}
                  onChange={(e) => updateEntry(entry.id, 'dateFrom', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Datum do:</label>
                <input
                  type="date"
                  value={entry.dateTo}
                  onChange={(e) => updateEntry(entry.id, 'dateTo', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Dny v týdnu:</label>
              <div className="days-grid">
                {daysOfWeek.map(day => (
                  <label key={day.value} className="day-checkbox">
                    <input
                      type="checkbox"
                      checked={entry.selectedDays.includes(day.value)}
                      onChange={() => toggleDay(entry.id, day.value)}
                    />
                    <span>{day.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Čas od:</label>
                <input
                  type="time"
                  value={entry.timeFrom}
                  onChange={(e) => updateEntry(entry.id, 'timeFrom', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Čas do:</label>
                <input
                  type="time"
                  value={entry.timeTo}
                  onChange={(e) => updateEntry(entry.id, 'timeTo', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="add-entry-btn" onClick={addEntry}>
          + Přidat další období
        </button>
        <button className="generate-btn" onClick={generateDOCX}>
          Generovat DOCX
        </button>
      </div>

      <div className="preview">
        <h3>Náhled generovaných dat ({generateDates().length} souborů):</h3>
        <div className="preview-list">
          {generateDates().slice(0, 10).map((date, i) => (
            <div key={i} className="preview-item">{date}</div>
          ))}
          {generateDates().length > 10 && (
            <div className="preview-item">... a dalších {generateDates().length - 10} souborů</div>
          )}
        </div>
        <p className="help-text" style={{marginTop: '15px'}}>
          💡 Výsledek: 1 DOCX soubor s {generateDates().length} {generateDates().length === 1 ? 'stránkou' : 'stránkami'}
        </p>
      </div>
    </div>
  )
}

export default App
