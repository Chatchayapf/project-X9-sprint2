import { useState } from 'react';
import { Send, CheckCircle2, Calendar, Shirt, Gift, FileCode } from 'lucide-react';
import { createCustomOrder } from '../services/customOrderServices';

export default function CustomOrder() {
  const [submitted, setSubmitted] = useState(false)
  const [designType, setDesignType] = useState('shirt_design')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const contactName = formData.get('contactName').trim()
    const contactInfo = formData.get('contactInfo').trim()
    const brief = formData.get('detail').trim()
    const deadline = formData.get('deadline_date')

    try {
      await createCustomOrder({
        name: contactName,
        detail: `Contact: ${contactInfo}\n\nBrief: ${brief}`,
        tags: [designType],
        ...(deadline ? { deadline_date: deadline } : {}),
      })
      setSubmitted(true)
      form.reset()
    } catch (error) {
      setSubmitError(error.message || 'Could not submit your custom order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-base-content">สั่งทำงานออกแบบเฉพาะ (Custom Order)</h1>
        <p className="text-base-content/60 text-sm max-w-xl mx-auto">
          กรอกรายละเอียดบรีฟงานออกแบบลายเสื้อ ของที่ระลึก หรือเทมเพลตเฉพาะสำหรับองค์กรของคุณ
        </p>
      </div>

      {submitted ? (
        <div className="card bg-base-200 border border-success/30 text-center p-8 space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-base-content">ส่งบรีฟงานสำเร็จแล้ว!</h2>
          <p className="text-base-content/60 text-sm max-w-md mx-auto">
            ทีมงาน Digi9Craft ได้รับข้อมูลคำขอ Custom ของคุณเรียบร้อยแล้ว และจะติดต่อกลับผ่านช่องทางที่คุณระบุโดยเร็วที่สุด
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn btn-primary mt-4"
          >
            ส่งบรีฟงานเพิ่มอีกรายการ
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="card bg-base-200 p-8 space-y-6 shadow-xl border border-base-300"
        >
          {/* Design Type selection */}
          <div className="space-y-3">
            <label className="label">
              <span className="label-text font-medium text-base-content/70">ประเภทงานที่ต้องการออกแบบ <span className="text-error">*</span></span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'shirt_design', label: 'ลายเสื้อสกรีน', icon: Shirt },
                { id: 'souvenir', label: 'สินค้าของที่ระลึก', icon: Gift },
                { id: 'template', label: 'เทมเพลต / อื่นๆ', icon: FileCode },
              ].map((type) => {
                const Icon = type.icon
                const isSelected = designType === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDesignType(type.id)}
                    className={`btn h-auto py-4 flex flex-row justify-start gap-3 items-center ${
                      isSelected ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium text-base-content/70">ชื่อผู้ติดต่อ / หน่วยงาน <span className="text-error">*</span></span>
              </div>
              <input
                required
                name="contactName"
                type="text"
                placeholder="เช่น โรงเรียน... หรือ คุณสมชาย"
                className="input input-bordered w-full focus:input-primary"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium text-base-content/70">อีเมล หรือ Line ID <span className="text-error">*</span></span>
              </div>
              <input
                required
                name="contactInfo"
                type="text"
                placeholder="email@domain.com หรือ Line ID"
                className="input input-bordered w-full focus:input-primary"
              />
            </label>
          </div>

          {/* Brief Details */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium text-base-content/70">รายละเอียดบรีฟงาน (Brief Details) <span className="text-error">*</span></span>
            </div>
            <textarea
              required
              name="detail"
              rows={4}
              placeholder="อธิบายแนวคิด ธีม สี ข้อความที่ต้องการใส่ หรือรูปแบบที่ต้องการ..."
              className="textarea textarea-bordered w-full focus:textarea-primary"
            />
          </label>

          {/* Deadline */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium text-base-content/70 flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span>กำหนดวันที่ต้องการรับงาน (Deadline)</span>
              </span>
            </div>
            <input
              type="date"
              name="deadline_date"
              className="input input-bordered w-full focus:input-primary"
            />
          </label>

          {/* Submit */}
          {submitError && (
            <p role="alert" className="text-error text-sm">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full mt-4"
          >
            <Send className="w-4 h-4" />
            <span>ส่งบรีฟงานออกแบบ</span>
          </button>
        </form>
      )}
    </div>
  )
}
